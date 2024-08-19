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
import bit.project.server.entity.Sheduledate;
import bit.project.server.dao.SheduledateDao;
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
@RequestMapping("/sheduledates")
public class SheduledateController{

    @Autowired
    private SheduledateDao sheduledateDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public SheduledateController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("sheduledate");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("SD");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Sheduledate> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all sheduledates", UsecaseList.SHOW_ALL_SHEDULEDATES);

        if(pageQuery.isEmptySearch()){
            return sheduledateDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Sheduledate> sheduledates = sheduledateDao.findAll(DEFAULT_SORT);
        Stream<Sheduledate> stream = sheduledates.parallelStream();

        List<Sheduledate> filteredSheduledates = stream.filter(sheduledate -> {
            if(code!=null)
                if(!sheduledate.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredSheduledates, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Sheduledate> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all sheduledates' basic data", UsecaseList.SHOW_ALL_SHEDULEDATES, UsecaseList.ADD_CLSSESSION, UsecaseList.UPDATE_CLSSESSION, UsecaseList.ADD_STUDENTATTENDANCE, UsecaseList.UPDATE_STUDENTATTENDANCE);
        return sheduledateDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Sheduledate get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get sheduledate", UsecaseList.SHOW_SHEDULEDATE_DETAILS, UsecaseList.UPDATE_SHEDULEDATE);
        Optional<Sheduledate> optionalSheduledate = sheduledateDao.findById(id);
        if(optionalSheduledate.isEmpty()) throw new ObjectNotFoundException("Sheduledate not found");
        return optionalSheduledate.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete sheduledates", UsecaseList.DELETE_SHEDULEDATE);

        try{
            if(sheduledateDao.existsById(id)) sheduledateDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this sheduledate already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Sheduledate sheduledate, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new sheduledate", UsecaseList.ADD_SHEDULEDATE);

        sheduledate.setTocreation(LocalDateTime.now());
        sheduledate.setCreator(authUser);
        sheduledate.setId(null);


        EntityValidator.validate(sheduledate);

        PersistHelper.save(()->{
            sheduledate.setCode(codeGenerator.getNextId(codeConfig));
            return sheduledateDao.save(sheduledate);
        });

        return new ResourceLink(sheduledate.getId(), "/sheduledates/"+sheduledate.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Sheduledate sheduledate, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update sheduledate details", UsecaseList.UPDATE_SHEDULEDATE);

        Optional<Sheduledate> optionalSheduledate = sheduledateDao.findById(id);
        if(optionalSheduledate.isEmpty()) throw new ObjectNotFoundException("Sheduledate not found");
        Sheduledate oldSheduledate = optionalSheduledate.get();

        sheduledate.setId(id);
        sheduledate.setCode(oldSheduledate.getCode());
        sheduledate.setCreator(oldSheduledate.getCreator());
        sheduledate.setTocreation(oldSheduledate.getTocreation());


        EntityValidator.validate(sheduledate);

        sheduledate = sheduledateDao.save(sheduledate);
        return new ResourceLink(sheduledate.getId(), "/sheduledates/"+sheduledate.getId());
    }

}