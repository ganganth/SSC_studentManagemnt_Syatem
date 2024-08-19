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
import bit.project.server.entity.Materialissue;
import bit.project.server.dao.MaterialissueDao;
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
@RequestMapping("/materialissues")
public class MaterialissueController{

    @Autowired
    private MaterialissueDao materialissueDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public MaterialissueController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("materialissue");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("MI");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Materialissue> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all materialissues", UsecaseList.SHOW_ALL_MATERIALISSUES);

        if(pageQuery.isEmptySearch()){
            return materialissueDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer gradeyearId = pageQuery.getSearchParamAsInteger("gradeyear");
        Integer clsId = pageQuery.getSearchParamAsInteger("cls");

        List<Materialissue> materialissues = materialissueDao.findAll(DEFAULT_SORT);
        Stream<Materialissue> stream = materialissues.parallelStream();

        List<Materialissue> filteredMaterialissues = stream.filter(materialissue -> {
            if(code!=null)
                if(!materialissue.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(gradeyearId!=null)
                if(!materialissue.getGradeyear().getId().equals(gradeyearId)) return false;
            if(clsId!=null)
                if(!materialissue.getCls().getId().equals(clsId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredMaterialissues, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Materialissue> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all materialissues' basic data", UsecaseList.SHOW_ALL_MATERIALISSUES);
        return materialissueDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Materialissue get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get materialissue", UsecaseList.SHOW_MATERIALISSUE_DETAILS, UsecaseList.UPDATE_MATERIALISSUE);
        Optional<Materialissue> optionalMaterialissue = materialissueDao.findById(id);
        if(optionalMaterialissue.isEmpty()) throw new ObjectNotFoundException("Materialissue not found");
        return optionalMaterialissue.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete materialissues", UsecaseList.DELETE_MATERIALISSUE);

        try{
            if(materialissueDao.existsById(id)) materialissueDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this materialissue already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Materialissue materialissue, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new materialissue", UsecaseList.ADD_MATERIALISSUE);

        materialissue.setTocreation(LocalDateTime.now());
        materialissue.setCreator(authUser);
        materialissue.setId(null);


        EntityValidator.validate(materialissue);

        PersistHelper.save(()->{
            materialissue.setCode(codeGenerator.getNextId(codeConfig));
            return materialissueDao.save(materialissue);
        });

        return new ResourceLink(materialissue.getId(), "/materialissues/"+materialissue.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Materialissue materialissue, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update materialissue details", UsecaseList.UPDATE_MATERIALISSUE);

        Optional<Materialissue> optionalMaterialissue = materialissueDao.findById(id);
        if(optionalMaterialissue.isEmpty()) throw new ObjectNotFoundException("Materialissue not found");
        Materialissue oldMaterialissue = optionalMaterialissue.get();

        materialissue.setId(id);
        materialissue.setCode(oldMaterialissue.getCode());
        materialissue.setCreator(oldMaterialissue.getCreator());
        materialissue.setTocreation(oldMaterialissue.getTocreation());


        EntityValidator.validate(materialissue);

        materialissue = materialissueDao.save(materialissue);
        return new ResourceLink(materialissue.getId(), "/materialissues/"+materialissue.getId());
    }

}