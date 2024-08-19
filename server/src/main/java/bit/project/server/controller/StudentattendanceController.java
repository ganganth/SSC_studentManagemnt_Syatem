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
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.entity.Studentattendance;
import bit.project.server.dao.StudentattendanceDao;
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
@RequestMapping("/studentattendances")
public class StudentattendanceController{

    @Autowired
    private StudentattendanceDao studentattendanceDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public StudentattendanceController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("studentattendance");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("SA");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Studentattendance> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all studentattendances", UsecaseList.SHOW_ALL_STUDENTATTENDANCES);

        if(pageQuery.isEmptySearch()){
            return studentattendanceDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Boolean attend = pageQuery.getSearchParamAsBoolean("attend");

        List<Studentattendance> studentattendances = studentattendanceDao.findAll(DEFAULT_SORT);
        Stream<Studentattendance> stream = studentattendances.parallelStream();

        List<Studentattendance> filteredStudentattendances = stream.filter(studentattendance -> {
            if(code!=null)
                if(!studentattendance.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(attend!=null)
                if(!studentattendance.getAttend().equals(attend)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredStudentattendances, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Studentattendance> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all studentattendances' basic data", UsecaseList.SHOW_ALL_STUDENTATTENDANCES);
        return studentattendanceDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Studentattendance get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get studentattendance", UsecaseList.SHOW_STUDENTATTENDANCE_DETAILS, UsecaseList.UPDATE_STUDENTATTENDANCE);
        Optional<Studentattendance> optionalStudentattendance = studentattendanceDao.findById(id);
        if(optionalStudentattendance.isEmpty()) throw new ObjectNotFoundException("Studentattendance not found");
        return optionalStudentattendance.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete studentattendances", UsecaseList.DELETE_STUDENTATTENDANCE);

        try{
            if(studentattendanceDao.existsById(id)) studentattendanceDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this studentattendance already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Studentattendance studentattendance, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new studentattendance", UsecaseList.ADD_STUDENTATTENDANCE);

        studentattendance.setTocreation(LocalDateTime.now());
        studentattendance.setCreator(authUser);
        studentattendance.setId(null);


        EntityValidator.validate(studentattendance);

        PersistHelper.save(()->{
            studentattendance.setCode(codeGenerator.getNextId(codeConfig));
            return studentattendanceDao.save(studentattendance);
        });

        return new ResourceLink(studentattendance.getId(), "/studentattendances/"+studentattendance.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Studentattendance studentattendance, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update studentattendance details", UsecaseList.UPDATE_STUDENTATTENDANCE);

        Optional<Studentattendance> optionalStudentattendance = studentattendanceDao.findById(id);
        if(optionalStudentattendance.isEmpty()) throw new ObjectNotFoundException("Studentattendance not found");
        Studentattendance oldStudentattendance = optionalStudentattendance.get();

        studentattendance.setId(id);
        studentattendance.setCode(oldStudentattendance.getCode());
        studentattendance.setCreator(oldStudentattendance.getCreator());
        studentattendance.setTocreation(oldStudentattendance.getTocreation());


        EntityValidator.validate(studentattendance);

        studentattendance = studentattendanceDao.save(studentattendance);
        return new ResourceLink(studentattendance.getId(), "/studentattendances/"+studentattendance.getId());
    }

}