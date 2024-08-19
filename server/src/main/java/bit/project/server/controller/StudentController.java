package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Student;
import bit.project.server.dao.StudentDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Studentstatus;
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
@RequestMapping("/students")
public class StudentController{

    @Autowired
    private StudentDao studentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public StudentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("student");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("ST");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Student> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all students", UsecaseList.SHOW_ALL_STUDENTS);

        if(pageQuery.isEmptySearch()){
            return studentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String callingname = pageQuery.getSearchParam("callingname");
        String nic = pageQuery.getSearchParam("nic");

        List<Student> students = studentDao.findAll(DEFAULT_SORT);
        Stream<Student> stream = students.parallelStream();

        List<Student> filteredStudents = stream.filter(student -> {
            if(code!=null)
                if(!student.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(callingname!=null)
                if(!student.getCallingname().toLowerCase().contains(callingname.toLowerCase())) return false;
            if(nic!=null)
                if(!student.getNic().toLowerCase().contains(nic.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredStudents, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Student> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all students' basic data", UsecaseList.SHOW_ALL_STUDENTS, UsecaseList.ADD_CLS, UsecaseList.UPDATE_CLS, UsecaseList.ADD_CLS, UsecaseList.UPDATE_CLS, UsecaseList.ADD_CLS, UsecaseList.UPDATE_CLS, UsecaseList.ADD_ENROLLMENT, UsecaseList.UPDATE_ENROLLMENT, UsecaseList.ADD_EXAMRESULT, UsecaseList.UPDATE_EXAMRESULT, UsecaseList.ADD_MATERIALISSUE, UsecaseList.UPDATE_MATERIALISSUE, UsecaseList.ADD_STUDENTATTENDANCE, UsecaseList.UPDATE_STUDENTATTENDANCE, UsecaseList.ADD_STUDENTPAYMENT, UsecaseList.UPDATE_STUDENTPAYMENT);
        return studentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Student get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get student", UsecaseList.SHOW_STUDENT_DETAILS, UsecaseList.UPDATE_STUDENT);
        Optional<Student> optionalStudent = studentDao.findById(id);
        if(optionalStudent.isEmpty()) throw new ObjectNotFoundException("Student not found");
        return optionalStudent.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete students", UsecaseList.DELETE_STUDENT);

        try{
            if(studentDao.existsById(id)) studentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this student already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Student student, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new student", UsecaseList.ADD_STUDENT);

        student.setTocreation(LocalDateTime.now());
        student.setCreator(authUser);
        student.setId(null);
        student.setStudentstatus(new Studentstatus(1));;


        EntityValidator.validate(student);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(student.getNic() != null){
            Student studentByNic = studentDao.findByNic(student.getNic());
            if(studentByNic!=null) errorBag.add("nic","nic already exists");
        }

        if(student.getMobile() != null){
            Student studentByMobile = studentDao.findByMobile(student.getMobile());
            if(studentByMobile!=null) errorBag.add("mobile","mobile already exists");
        }

        if(student.getEmail() != null){
            Student studentByEmail = studentDao.findByEmail(student.getEmail());
            if(studentByEmail!=null) errorBag.add("email","email already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            student.setCode(codeGenerator.getNextId(codeConfig));
            return studentDao.save(student);
        });

        return new ResourceLink(student.getId(), "/students/"+student.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Student student, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update student details", UsecaseList.UPDATE_STUDENT);

        Optional<Student> optionalStudent = studentDao.findById(id);
        if(optionalStudent.isEmpty()) throw new ObjectNotFoundException("Student not found");
        Student oldStudent = optionalStudent.get();

        student.setId(id);
        student.setCode(oldStudent.getCode());
        student.setCreator(oldStudent.getCreator());
        student.setTocreation(oldStudent.getTocreation());


        EntityValidator.validate(student);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(student.getNic() != null){
            Student studentByNic = studentDao.findByNic(student.getNic());
            if(studentByNic!=null)
                if(!studentByNic.getId().equals(id))
                    errorBag.add("nic","nic already exists");
        }

        if(student.getMobile() != null){
            Student studentByMobile = studentDao.findByMobile(student.getMobile());
            if(studentByMobile!=null)
                if(!studentByMobile.getId().equals(id))
                    errorBag.add("mobile","mobile already exists");
        }

        if(student.getEmail() != null){
            Student studentByEmail = studentDao.findByEmail(student.getEmail());
            if(studentByEmail!=null)
                if(!studentByEmail.getId().equals(id))
                    errorBag.add("email","email already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        student = studentDao.save(student);
        return new ResourceLink(student.getId(), "/students/"+student.getId());
    }

}