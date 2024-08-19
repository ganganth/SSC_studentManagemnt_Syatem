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
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Studentpayment;
import bit.project.server.dao.StudentpaymentDao;
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
@RequestMapping("/studentpayments")
public class StudentpaymentController{

    @Autowired
    private StudentpaymentDao studentpaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public StudentpaymentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("studentpayment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("P");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Studentpayment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all studentpayments", UsecaseList.SHOW_ALL_STUDENTPAYMENTS);

        if(pageQuery.isEmptySearch()){
            return studentpaymentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Studentpayment> studentpayments = studentpaymentDao.findAll(DEFAULT_SORT);
        Stream<Studentpayment> stream = studentpayments.parallelStream();

        List<Studentpayment> filteredStudentpayments = stream.filter(studentpayment -> {
            if(code!=null)
                if(!studentpayment.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredStudentpayments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Studentpayment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all studentpayments' basic data", UsecaseList.SHOW_ALL_STUDENTPAYMENTS);
        return studentpaymentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Studentpayment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get studentpayment", UsecaseList.SHOW_STUDENTPAYMENT_DETAILS, UsecaseList.UPDATE_STUDENTPAYMENT);
        Optional<Studentpayment> optionalStudentpayment = studentpaymentDao.findById(id);
        if(optionalStudentpayment.isEmpty()) throw new ObjectNotFoundException("Studentpayment not found");
        return optionalStudentpayment.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete studentpayments", UsecaseList.DELETE_STUDENTPAYMENT);

        try{
            if(studentpaymentDao.existsById(id)) studentpaymentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this studentpayment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Studentpayment studentpayment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new studentpayment", UsecaseList.ADD_STUDENTPAYMENT);

        studentpayment.setTocreation(LocalDateTime.now());
        studentpayment.setCreator(authUser);
        studentpayment.setId(null);


        EntityValidator.validate(studentpayment);

        PersistHelper.save(()->{
            studentpayment.setCode(codeGenerator.getNextId(codeConfig));
            return studentpaymentDao.save(studentpayment);
        });

        return new ResourceLink(studentpayment.getId(), "/studentpayments/"+studentpayment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Studentpayment studentpayment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update studentpayment details", UsecaseList.UPDATE_STUDENTPAYMENT);

        Optional<Studentpayment> optionalStudentpayment = studentpaymentDao.findById(id);
        if(optionalStudentpayment.isEmpty()) throw new ObjectNotFoundException("Studentpayment not found");
        Studentpayment oldStudentpayment = optionalStudentpayment.get();

        studentpayment.setId(id);
        studentpayment.setCode(oldStudentpayment.getCode());
        studentpayment.setCreator(oldStudentpayment.getCreator());
        studentpayment.setTocreation(oldStudentpayment.getTocreation());
        studentpayment.setPrevbalance(oldStudentpayment.getPrevbalance());
        studentpayment.setBalance(oldStudentpayment.getBalance());
        studentpayment.setInsno(oldStudentpayment.getInsno());


        EntityValidator.validate(studentpayment);

        studentpayment = studentpaymentDao.save(studentpayment);
        return new ResourceLink(studentpayment.getId(), "/studentpayments/"+studentpayment.getId());
    }

}