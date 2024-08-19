package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Yearterm;
import bit.project.server.entity.Gradeyear;
import bit.project.server.dao.GradeyearDao;
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
@RequestMapping("/gradeyears")
public class GradeyearController{

    @Autowired
    private GradeyearDao gradeyearDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public GradeyearController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("gradeyear");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("GY");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Gradeyear> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all gradeyears", UsecaseList.SHOW_ALL_GRADEYEARS);

        if(pageQuery.isEmptySearch()){
            return gradeyearDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Gradeyear> gradeyears = gradeyearDao.findAll(DEFAULT_SORT);
        Stream<Gradeyear> stream = gradeyears.parallelStream();

        List<Gradeyear> filteredGradeyears = stream.filter(gradeyear -> {
            if(code!=null)
                if(!gradeyear.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredGradeyears, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Gradeyear> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all gradeyears' basic data", UsecaseList.SHOW_ALL_GRADEYEARS, UsecaseList.ADD_CLS, UsecaseList.UPDATE_CLS, UsecaseList.ADD_ENROLLMENT, UsecaseList.UPDATE_ENROLLMENT, UsecaseList.ADD_EXAM, UsecaseList.UPDATE_EXAM, UsecaseList.ADD_MATERIALISSUE, UsecaseList.UPDATE_MATERIALISSUE, UsecaseList.ADD_TIMETABLE, UsecaseList.UPDATE_TIMETABLE);
        return gradeyearDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Gradeyear get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get gradeyear", UsecaseList.SHOW_GRADEYEAR_DETAILS, UsecaseList.UPDATE_GRADEYEAR);
        Optional<Gradeyear> optionalGradeyear = gradeyearDao.findById(id);
        if(optionalGradeyear.isEmpty()) throw new ObjectNotFoundException("Gradeyear not found");
        return optionalGradeyear.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete gradeyears", UsecaseList.DELETE_GRADEYEAR);

        try{
            if(gradeyearDao.existsById(id)) gradeyearDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this gradeyear already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Gradeyear gradeyear, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new gradeyear", UsecaseList.ADD_GRADEYEAR);

        gradeyear.setTocreation(LocalDateTime.now());
        gradeyear.setCreator(authUser);
        gradeyear.setId(null);

        for(Yearterm yearterm : gradeyear.getYeartermList()) yearterm.setGradeyear(gradeyear);

        EntityValidator.validate(gradeyear);

        PersistHelper.save(()->{
            gradeyear.setCode(codeGenerator.getNextId(codeConfig));
            return gradeyearDao.save(gradeyear);
        });

        return new ResourceLink(gradeyear.getId(), "/gradeyears/"+gradeyear.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Gradeyear gradeyear, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update gradeyear details", UsecaseList.UPDATE_GRADEYEAR);

        Optional<Gradeyear> optionalGradeyear = gradeyearDao.findById(id);
        if(optionalGradeyear.isEmpty()) throw new ObjectNotFoundException("Gradeyear not found");
        Gradeyear oldGradeyear = optionalGradeyear.get();

        gradeyear.setId(id);
        gradeyear.setCode(oldGradeyear.getCode());
        gradeyear.setCreator(oldGradeyear.getCreator());
        gradeyear.setTocreation(oldGradeyear.getTocreation());

        for(Yearterm yearterm : gradeyear.getYeartermList()) yearterm.setGradeyear(gradeyear);

        EntityValidator.validate(gradeyear);

        gradeyear = gradeyearDao.save(gradeyear);
        return new ResourceLink(gradeyear.getId(), "/gradeyears/"+gradeyear.getId());
    }

}