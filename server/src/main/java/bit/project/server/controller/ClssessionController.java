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
import bit.project.server.entity.Clssession;
import bit.project.server.dao.ClssessionDao;
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
@RequestMapping("/clssessions")
public class ClssessionController{

    @Autowired
    private ClssessionDao clssessionDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ClssessionController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("clssession");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CS");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Clssession> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all clssessions", UsecaseList.SHOW_ALL_CLSSESSIONS);

        if(pageQuery.isEmptySearch()){
            return clssessionDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer clsId = pageQuery.getSearchParamAsInteger("cls");
        Integer gradeId = pageQuery.getSearchParamAsInteger("grade");

        List<Clssession> clssessions = clssessionDao.findAll(DEFAULT_SORT);
        Stream<Clssession> stream = clssessions.parallelStream();

        List<Clssession> filteredClssessions = stream.filter(clssession -> {
            if(code!=null)
                if(!clssession.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(clsId!=null)
                if(!clssession.getCls().getId().equals(clsId)) return false;
            if(gradeId!=null)
                if(!clssession.getGrade().getId().equals(gradeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredClssessions, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Clssession> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all clssessions' basic data", UsecaseList.SHOW_ALL_CLSSESSIONS);
        return clssessionDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Clssession get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get clssession", UsecaseList.SHOW_CLSSESSION_DETAILS, UsecaseList.UPDATE_CLSSESSION);
        Optional<Clssession> optionalClssession = clssessionDao.findById(id);
        if(optionalClssession.isEmpty()) throw new ObjectNotFoundException("Clssession not found");
        return optionalClssession.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete clssessions", UsecaseList.DELETE_CLSSESSION);

        try{
            if(clssessionDao.existsById(id)) clssessionDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this clssession already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Clssession clssession, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new clssession", UsecaseList.ADD_CLSSESSION);

        clssession.setTocreation(LocalDateTime.now());
        clssession.setCreator(authUser);
        clssession.setId(null);


        EntityValidator.validate(clssession);

        PersistHelper.save(()->{
            clssession.setCode(codeGenerator.getNextId(codeConfig));
            return clssessionDao.save(clssession);
        });

        return new ResourceLink(clssession.getId(), "/clssessions/"+clssession.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Clssession clssession, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update clssession details", UsecaseList.UPDATE_CLSSESSION);

        Optional<Clssession> optionalClssession = clssessionDao.findById(id);
        if(optionalClssession.isEmpty()) throw new ObjectNotFoundException("Clssession not found");
        Clssession oldClssession = optionalClssession.get();

        clssession.setId(id);
        clssession.setCode(oldClssession.getCode());
        clssession.setCreator(oldClssession.getCreator());
        clssession.setTocreation(oldClssession.getTocreation());


        EntityValidator.validate(clssession);

        clssession = clssessionDao.save(clssession);
        return new ResourceLink(clssession.getId(), "/clssessions/"+clssession.getId());
    }

}