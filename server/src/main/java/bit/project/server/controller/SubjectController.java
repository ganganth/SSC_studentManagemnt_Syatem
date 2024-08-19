package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Subject;
import bit.project.server.dao.SubjectDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
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
@RequestMapping("/subjects")
public class SubjectController{

    @Autowired
    private SubjectDao subjectDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public SubjectController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("subject");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("S");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Subject> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all subjects", UsecaseList.SHOW_ALL_SUBJECTS);

        if(pageQuery.isEmptySearch()){
            return subjectDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");
        Integer gradeId = pageQuery.getSearchParamAsInteger("grade");
        Integer mediumId = pageQuery.getSearchParamAsInteger("medium");

        List<Subject> subjects = subjectDao.findAll(DEFAULT_SORT);
        Stream<Subject> stream = subjects.parallelStream();

        List<Subject> filteredSubjects = stream.filter(subject -> {
            if(code!=null)
                if(!subject.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!subject.getName().toLowerCase().contains(name.toLowerCase())) return false;
            if(gradeId!=null)
                if(!subject.getGrade().getId().equals(gradeId)) return false;
            if(mediumId!=null)
                if(!subject.getMedium().getId().equals(mediumId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredSubjects, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Subject> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all subjects' basic data", UsecaseList.SHOW_ALL_SUBJECTS, UsecaseList.ADD_EXAM, UsecaseList.UPDATE_EXAM, UsecaseList.ADD_LESSON, UsecaseList.UPDATE_LESSON, UsecaseList.ADD_MATERIAL, UsecaseList.UPDATE_MATERIAL, UsecaseList.ADD_TIMETABLE, UsecaseList.UPDATE_TIMETABLE);
        return subjectDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Subject get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get subject", UsecaseList.SHOW_SUBJECT_DETAILS, UsecaseList.UPDATE_SUBJECT);
        Optional<Subject> optionalSubject = subjectDao.findById(id);
        if(optionalSubject.isEmpty()) throw new ObjectNotFoundException("Subject not found");
        return optionalSubject.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete subjects", UsecaseList.DELETE_SUBJECT);

        try{
            if(subjectDao.existsById(id)) subjectDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this subject already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Subject subject, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new subject", UsecaseList.ADD_SUBJECT);

        subject.setTocreation(LocalDateTime.now());
        subject.setCreator(authUser);
        subject.setId(null);


        EntityValidator.validate(subject);

        PersistHelper.save(()->{
            subject.setCode(codeGenerator.getNextId(codeConfig));
            return subjectDao.save(subject);
        });

        return new ResourceLink(subject.getId(), "/subjects/"+subject.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Subject subject, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update subject details", UsecaseList.UPDATE_SUBJECT);

        Optional<Subject> optionalSubject = subjectDao.findById(id);
        if(optionalSubject.isEmpty()) throw new ObjectNotFoundException("Subject not found");
        Subject oldSubject = optionalSubject.get();

        subject.setId(id);
        subject.setCode(oldSubject.getCode());
        subject.setCreator(oldSubject.getCreator());
        subject.setTocreation(oldSubject.getTocreation());


        EntityValidator.validate(subject);

        subject = subjectDao.save(subject);
        return new ResourceLink(subject.getId(), "/subjects/"+subject.getId());
    }

}