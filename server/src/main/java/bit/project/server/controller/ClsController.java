package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.entity.Cls;
import bit.project.server.dao.ClsDao;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import bit.project.server.entity.Clssubject;
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
@RequestMapping("/clses")
public class ClsController{

    @Autowired
    private ClsDao clsDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ClsController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("cls");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("C");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Cls> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all classes", UsecaseList.SHOW_ALL_CLSES);

        if(pageQuery.isEmptySearch()){
            return clsDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");
        Integer mediumId = pageQuery.getSearchParamAsInteger("medium");
        Integer teacherId = pageQuery.getSearchParamAsInteger("teacher");
        Integer assistantteacherId = pageQuery.getSearchParamAsInteger("assistantteacher");
        Integer monitorId = pageQuery.getSearchParamAsInteger("monitor");
        Integer vicemonitorId = pageQuery.getSearchParamAsInteger("vicemonitor");

        List<Cls> clses = clsDao.findAll(DEFAULT_SORT);
        Stream<Cls> stream = clses.parallelStream();

        List<Cls> filteredClses = stream.filter(cls -> {
            if(code!=null)
                if(!cls.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!cls.getName().toLowerCase().contains(name.toLowerCase())) return false;
            if(mediumId!=null)
                if(!cls.getMedium().getId().equals(mediumId)) return false;
            if(teacherId!=null)
                if(!cls.getTeacher().getId().equals(teacherId)) return false;
            if(assistantteacherId!=null)
                if(!cls.getAssistantteacher().getId().equals(assistantteacherId)) return false;
            if(monitorId!=null)
                if(!cls.getMonitor().getId().equals(monitorId)) return false;
            if(vicemonitorId!=null)
                if(!cls.getVicemonitor().getId().equals(vicemonitorId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredClses, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Cls> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all classes' basic data", UsecaseList.SHOW_ALL_CLSES, UsecaseList.ADD_CLSSESSION, UsecaseList.UPDATE_CLSSESSION, UsecaseList.ADD_MATERIALISSUE, UsecaseList.UPDATE_MATERIALISSUE, UsecaseList.ADD_STUDENTATTENDANCE, UsecaseList.UPDATE_STUDENTATTENDANCE, UsecaseList.ADD_TIMETABLE, UsecaseList.UPDATE_TIMETABLE);
        return clsDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Cls get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get class", UsecaseList.SHOW_CLS_DETAILS, UsecaseList.UPDATE_CLS);
        Optional<Cls> optionalCls = clsDao.findById(id);
        if(optionalCls.isEmpty()) throw new ObjectNotFoundException("Class not found");
        return optionalCls.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete classes", UsecaseList.DELETE_CLS);

        try{
            if(clsDao.existsById(id)) clsDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this cls already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Cls cls, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new class", UsecaseList.ADD_CLS);

        cls.setTocreation(LocalDateTime.now());
        cls.setCreator(authUser);
        cls.setId(null);

        for(Clssubject clssubject : cls.getClssubjectList()) clssubject.setCls(cls);

        EntityValidator.validate(cls);

        PersistHelper.save(()->{
            cls.setCode(codeGenerator.getNextId(codeConfig));
            return clsDao.save(cls);
        });

        return new ResourceLink(cls.getId(), "/clses/"+cls.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Cls cls, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update class details", UsecaseList.UPDATE_CLS);

        Optional<Cls> optionalCls = clsDao.findById(id);
        if(optionalCls.isEmpty()) throw new ObjectNotFoundException("Class not found");
        Cls oldCls = optionalCls.get();

        cls.setId(id);
        cls.setCode(oldCls.getCode());
        cls.setCreator(oldCls.getCreator());
        cls.setTocreation(oldCls.getTocreation());

        for(Clssubject clssubject : cls.getClssubjectList()) clssubject.setCls(cls);

        EntityValidator.validate(cls);

        cls = clsDao.save(cls);
        return new ResourceLink(cls.getId(), "/clses/"+cls.getId());
    }

}
