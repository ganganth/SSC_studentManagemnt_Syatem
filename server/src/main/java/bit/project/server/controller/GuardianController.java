package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Guardian;
import bit.project.server.dao.GuardianDao;
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
@RequestMapping("/guardians")
public class GuardianController{

    @Autowired
    private GuardianDao guardianDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public GuardianController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("guardian");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("GU");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Guardian> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all guardians", UsecaseList.SHOW_ALL_GUARDIANS);

        if(pageQuery.isEmptySearch()){
            return guardianDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String callingname = pageQuery.getSearchParam("callingname");
        String nic = pageQuery.getSearchParam("nic");

        List<Guardian> guardians = guardianDao.findAll(DEFAULT_SORT);
        Stream<Guardian> stream = guardians.parallelStream();

        List<Guardian> filteredGuardians = stream.filter(guardian -> {
            if(code!=null)
                if(!guardian.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(callingname!=null)
                if(!guardian.getCallingname().toLowerCase().contains(callingname.toLowerCase())) return false;
            if(nic!=null)
                if(!guardian.getNic().toLowerCase().contains(nic.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredGuardians, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Guardian> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all guardians' basic data", UsecaseList.SHOW_ALL_GUARDIANS, UsecaseList.ADD_STUDENT, UsecaseList.UPDATE_STUDENT);
        return guardianDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Guardian get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get guardian", UsecaseList.SHOW_GUARDIAN_DETAILS, UsecaseList.UPDATE_GUARDIAN);
        Optional<Guardian> optionalGuardian = guardianDao.findById(id);
        if(optionalGuardian.isEmpty()) throw new ObjectNotFoundException("Guardian not found");
        return optionalGuardian.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete guardians", UsecaseList.DELETE_GUARDIAN);

        try{
            if(guardianDao.existsById(id)) guardianDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this guardian already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Guardian guardian, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new guardian", UsecaseList.ADD_GUARDIAN);

        guardian.setTocreation(LocalDateTime.now());
        guardian.setCreator(authUser);
        guardian.setId(null);


        EntityValidator.validate(guardian);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(guardian.getNic() != null){
            Guardian guardianByNic = guardianDao.findByNic(guardian.getNic());
            if(guardianByNic!=null) errorBag.add("nic","nic already exists");
        }

        if(guardian.getMobile() != null){
            Guardian guardianByMobile = guardianDao.findByMobile(guardian.getMobile());
            if(guardianByMobile!=null) errorBag.add("mobile","mobile already exists");
        }

        if(guardian.getEmail() != null){
            Guardian guardianByEmail = guardianDao.findByEmail(guardian.getEmail());
            if(guardianByEmail!=null) errorBag.add("email","email already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            guardian.setCode(codeGenerator.getNextId(codeConfig));
            return guardianDao.save(guardian);
        });

        return new ResourceLink(guardian.getId(), "/guardians/"+guardian.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Guardian guardian, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update guardian details", UsecaseList.UPDATE_GUARDIAN);

        Optional<Guardian> optionalGuardian = guardianDao.findById(id);
        if(optionalGuardian.isEmpty()) throw new ObjectNotFoundException("Guardian not found");
        Guardian oldGuardian = optionalGuardian.get();

        guardian.setId(id);
        guardian.setCode(oldGuardian.getCode());
        guardian.setCreator(oldGuardian.getCreator());
        guardian.setTocreation(oldGuardian.getTocreation());


        EntityValidator.validate(guardian);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(guardian.getNic() != null){
            Guardian guardianByNic = guardianDao.findByNic(guardian.getNic());
            if(guardianByNic!=null)
                if(!guardianByNic.getId().equals(id))
                    errorBag.add("nic","nic already exists");
        }

        if(guardian.getMobile() != null){
            Guardian guardianByMobile = guardianDao.findByMobile(guardian.getMobile());
            if(guardianByMobile!=null)
                if(!guardianByMobile.getId().equals(id))
                    errorBag.add("mobile","mobile already exists");
        }

        if(guardian.getEmail() != null){
            Guardian guardianByEmail = guardianDao.findByEmail(guardian.getEmail());
            if(guardianByEmail!=null)
                if(!guardianByEmail.getId().equals(id))
                    errorBag.add("email","email already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        guardian = guardianDao.save(guardian);
        return new ResourceLink(guardian.getId(), "/guardians/"+guardian.getId());
    }

}