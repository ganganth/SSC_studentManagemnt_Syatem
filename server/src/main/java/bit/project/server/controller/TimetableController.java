package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Timetable;
import bit.project.server.dao.TimetableDao;
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
@RequestMapping("/timetables")
public class TimetableController{

    @Autowired
    private TimetableDao timetableDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public TimetableController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("timetable");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("TT");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Timetable> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all timetables", UsecaseList.SHOW_ALL_TIMETABLES);

        if(pageQuery.isEmptySearch()){
            return timetableDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer gradeId = pageQuery.getSearchParamAsInteger("grade");
        Integer gradeyearId = pageQuery.getSearchParamAsInteger("gradeyear");
        Integer subjectId = pageQuery.getSearchParamAsInteger("subject");
        Integer teacherId = pageQuery.getSearchParamAsInteger("teacher");
        Integer clsId = pageQuery.getSearchParamAsInteger("cls");

        List<Timetable> timetables = timetableDao.findAll(DEFAULT_SORT);
        Stream<Timetable> stream = timetables.parallelStream();

        List<Timetable> filteredTimetables = stream.filter(timetable -> {
            if(code!=null)
                if(!timetable.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(gradeId!=null)
                if(!timetable.getGrade().getId().equals(gradeId)) return false;
            if(gradeyearId!=null)
                if(!timetable.getGradeyear().getId().equals(gradeyearId)) return false;
            if(subjectId!=null)
                if(!timetable.getSubject().getId().equals(subjectId)) return false;
            if(teacherId!=null)
                if(!timetable.getTeacher().getId().equals(teacherId)) return false;
            if(clsId!=null)
                if(!timetable.getCls().getId().equals(clsId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredTimetables, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Timetable> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all timetables' basic data", UsecaseList.SHOW_ALL_TIMETABLES, UsecaseList.ADD_CLSSESSION, UsecaseList.UPDATE_CLSSESSION);
        return timetableDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Timetable get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get timetable", UsecaseList.SHOW_TIMETABLE_DETAILS, UsecaseList.UPDATE_TIMETABLE);
        Optional<Timetable> optionalTimetable = timetableDao.findById(id);
        if(optionalTimetable.isEmpty()) throw new ObjectNotFoundException("Timetable not found");
        return optionalTimetable.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete timetables", UsecaseList.DELETE_TIMETABLE);

        try{
            if(timetableDao.existsById(id)) timetableDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this timetable already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Timetable timetable, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new timetable", UsecaseList.ADD_TIMETABLE);

        timetable.setTocreation(LocalDateTime.now());
        timetable.setCreator(authUser);
        timetable.setId(null);


        EntityValidator.validate(timetable);

        PersistHelper.save(()->{
            timetable.setCode(codeGenerator.getNextId(codeConfig));
            return timetableDao.save(timetable);
        });

        return new ResourceLink(timetable.getId(), "/timetables/"+timetable.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Timetable timetable, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update timetable details", UsecaseList.UPDATE_TIMETABLE);

        Optional<Timetable> optionalTimetable = timetableDao.findById(id);
        if(optionalTimetable.isEmpty()) throw new ObjectNotFoundException("Timetable not found");
        Timetable oldTimetable = optionalTimetable.get();

        timetable.setId(id);
        timetable.setCode(oldTimetable.getCode());
        timetable.setCreator(oldTimetable.getCreator());
        timetable.setTocreation(oldTimetable.getTocreation());


        EntityValidator.validate(timetable);

        timetable = timetableDao.save(timetable);
        return new ResourceLink(timetable.getId(), "/timetables/"+timetable.getId());
    }

}