package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.entity.Exam;
import bit.project.server.dao.ExamDao;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import bit.project.server.entity.Examstatus;
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
@RequestMapping("/exams")
public class ExamController{

    @Autowired
    private ExamDao examDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ExamController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("exam");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("EX");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Exam> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all exams", UsecaseList.SHOW_ALL_EXAMS);

        if(pageQuery.isEmptySearch()){
            return examDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Exam> exams = examDao.findAll(DEFAULT_SORT);
        Stream<Exam> stream = exams.parallelStream();

        List<Exam> filteredExams = stream.filter(exam -> {
            if(code!=null)
                if(!exam.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredExams, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Exam> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all exams' basic data", UsecaseList.SHOW_ALL_EXAMS, UsecaseList.ADD_EXAMRESULT, UsecaseList.UPDATE_EXAMRESULT);
        return examDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Exam get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get exam", UsecaseList.SHOW_EXAM_DETAILS, UsecaseList.UPDATE_EXAM);
        Optional<Exam> optionalExam = examDao.findById(id);
        if(optionalExam.isEmpty()) throw new ObjectNotFoundException("Exam not found");
        return optionalExam.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete exams", UsecaseList.DELETE_EXAM);

        try{
            if(examDao.existsById(id)) examDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this exam already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Exam exam, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new exam", UsecaseList.ADD_EXAM);

        exam.setTocreation(LocalDateTime.now());
        exam.setCreator(authUser);
        exam.setId(null);
        exam.setExamstatus(new Examstatus(1));;


        EntityValidator.validate(exam);

        PersistHelper.save(()->{
            exam.setCode(codeGenerator.getNextId(codeConfig));
            return examDao.save(exam);
        });

        return new ResourceLink(exam.getId(), "/exams/"+exam.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Exam exam, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update exam details", UsecaseList.UPDATE_EXAM);

        Optional<Exam> optionalExam = examDao.findById(id);
        if(optionalExam.isEmpty()) throw new ObjectNotFoundException("Exam not found");
        Exam oldExam = optionalExam.get();

        exam.setId(id);
        exam.setCode(oldExam.getCode());
        exam.setCreator(oldExam.getCreator());
        exam.setTocreation(oldExam.getTocreation());


        EntityValidator.validate(exam);

        exam = examDao.save(exam);
        return new ResourceLink(exam.getId(), "/exams/"+exam.getId());
    }

}