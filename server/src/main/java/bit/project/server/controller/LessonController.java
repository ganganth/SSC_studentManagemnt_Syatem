package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Lesson;
import bit.project.server.dao.LessonDao;
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
@RequestMapping("/lessons")
public class LessonController{

    @Autowired
    private LessonDao lessonDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public LessonController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("lesson");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("LS");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Lesson> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all lessons", UsecaseList.SHOW_ALL_LESSONS);

        if(pageQuery.isEmptySearch()){
            return lessonDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer gradeId = pageQuery.getSearchParamAsInteger("grade");
        Integer subjectId = pageQuery.getSearchParamAsInteger("subject");
        String name = pageQuery.getSearchParam("name");

        List<Lesson> lessons = lessonDao.findAll(DEFAULT_SORT);
        Stream<Lesson> stream = lessons.parallelStream();

        List<Lesson> filteredLessons = stream.filter(lesson -> {
            if(code!=null)
                if(!lesson.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(gradeId!=null)
                if(!lesson.getGrade().getId().equals(gradeId)) return false;
            if(subjectId!=null)
                if(!lesson.getSubject().getId().equals(subjectId)) return false;
            if(name!=null)
                if(!lesson.getName().toLowerCase().contains(name.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredLessons, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Lesson> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all lessons' basic data", UsecaseList.SHOW_ALL_LESSONS, UsecaseList.ADD_CLSSESSION, UsecaseList.UPDATE_CLSSESSION, UsecaseList.ADD_MATERIAL, UsecaseList.UPDATE_MATERIAL);
        return lessonDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Lesson get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get lesson", UsecaseList.SHOW_LESSON_DETAILS, UsecaseList.UPDATE_LESSON);
        Optional<Lesson> optionalLesson = lessonDao.findById(id);
        if(optionalLesson.isEmpty()) throw new ObjectNotFoundException("Lesson not found");
        return optionalLesson.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete lessons", UsecaseList.DELETE_LESSON);

        try{
            if(lessonDao.existsById(id)) lessonDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this lesson already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Lesson lesson, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new lesson", UsecaseList.ADD_LESSON);

        lesson.setTocreation(LocalDateTime.now());
        lesson.setCreator(authUser);
        lesson.setId(null);


        EntityValidator.validate(lesson);

        PersistHelper.save(()->{
            lesson.setCode(codeGenerator.getNextId(codeConfig));
            return lessonDao.save(lesson);
        });

        return new ResourceLink(lesson.getId(), "/lessons/"+lesson.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Lesson lesson, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update lesson details", UsecaseList.UPDATE_LESSON);

        Optional<Lesson> optionalLesson = lessonDao.findById(id);
        if(optionalLesson.isEmpty()) throw new ObjectNotFoundException("Lesson not found");
        Lesson oldLesson = optionalLesson.get();

        lesson.setId(id);
        lesson.setCode(oldLesson.getCode());
        lesson.setCreator(oldLesson.getCreator());
        lesson.setTocreation(oldLesson.getTocreation());


        EntityValidator.validate(lesson);

        lesson = lessonDao.save(lesson);
        return new ResourceLink(lesson.getId(), "/lessons/"+lesson.getId());
    }

}