package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import bit.project.server.entity.Enrollment;
import bit.project.server.dao.EnrollmentDao;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/enrollments")
public class EnrollmentController{

    @Autowired
    private EnrollmentDao enrollmentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public EnrollmentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("enrollment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("EN");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Enrollment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all enrollments", UsecaseList.SHOW_ALL_ENROLLMENTS);

        if(pageQuery.isEmptySearch()){
            return enrollmentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Enrollment> enrollments = enrollmentDao.findAll(DEFAULT_SORT);
        Stream<Enrollment> stream = enrollments.parallelStream();

        List<Enrollment> filteredEnrollments = stream.filter(enrollment -> {
            if(code!=null)
                if(!enrollment.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredEnrollments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Enrollment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all enrollments' basic data", UsecaseList.SHOW_ALL_ENROLLMENTS, UsecaseList.ADD_STUDENTPAYMENT, UsecaseList.UPDATE_STUDENTPAYMENT);
        return enrollmentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Enrollment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get enrollment", UsecaseList.SHOW_ENROLLMENT_DETAILS, UsecaseList.UPDATE_ENROLLMENT);
        Optional<Enrollment> optionalEnrollment = enrollmentDao.findById(id);
        if(optionalEnrollment.isEmpty()) throw new ObjectNotFoundException("Enrollment not found");
        return optionalEnrollment.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete enrollments", UsecaseList.DELETE_ENROLLMENT);

        try{
            if(enrollmentDao.existsById(id)) enrollmentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this enrollment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Enrollment enrollment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new enrollment", UsecaseList.ADD_ENROLLMENT);

        enrollment.setTocreation(LocalDateTime.now());
        enrollment.setCreator(authUser);
        enrollment.setId(null);


        EntityValidator.validate(enrollment);

        PersistHelper.save(()->{
            enrollment.setCode(codeGenerator.getNextId(codeConfig));
            return enrollmentDao.save(enrollment);
        });

        return new ResourceLink(enrollment.getId(), "/enrollments/"+enrollment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Enrollment enrollment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update enrollment details", UsecaseList.UPDATE_ENROLLMENT);

        Optional<Enrollment> optionalEnrollment = enrollmentDao.findById(id);
        if(optionalEnrollment.isEmpty()) throw new ObjectNotFoundException("Enrollment not found");
        Enrollment oldEnrollment = optionalEnrollment.get();

        enrollment.setId(id);
        enrollment.setCode(oldEnrollment.getCode());
        enrollment.setCreator(oldEnrollment.getCreator());
        enrollment.setTocreation(oldEnrollment.getTocreation());
        enrollment.setBalance(oldEnrollment.getBalance());


        EntityValidator.validate(enrollment);

        enrollment = enrollmentDao.save(enrollment);
        return new ResourceLink(enrollment.getId(), "/enrollments/"+enrollment.getId());
    }

}