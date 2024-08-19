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
import bit.project.server.entity.Examresult;
import bit.project.server.dao.ExamresultDao;
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
@RequestMapping("/examresults")
public class ExamresultController{

    @Autowired
    private ExamresultDao examresultDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ExamresultController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("examresult");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("ER");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Examresult> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all examresults", UsecaseList.SHOW_ALL_EXAMRESULTS);

        if(pageQuery.isEmptySearch()){
            return examresultDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Boolean isprersent = pageQuery.getSearchParamAsBoolean("isprersent");

        List<Examresult> examresults = examresultDao.findAll(DEFAULT_SORT);
        Stream<Examresult> stream = examresults.parallelStream();

        List<Examresult> filteredExamresults = stream.filter(examresult -> {
            if(code!=null)
                if(!examresult.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(isprersent!=null)
                if(!examresult.getIsprersent().equals(isprersent)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredExamresults, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Examresult> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all examresults' basic data", UsecaseList.SHOW_ALL_EXAMRESULTS);
        return examresultDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Examresult get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get examresult", UsecaseList.SHOW_EXAMRESULT_DETAILS, UsecaseList.UPDATE_EXAMRESULT);
        Optional<Examresult> optionalExamresult = examresultDao.findById(id);
        if(optionalExamresult.isEmpty()) throw new ObjectNotFoundException("Examresult not found");
        return optionalExamresult.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete examresults", UsecaseList.DELETE_EXAMRESULT);

        try{
            if(examresultDao.existsById(id)) examresultDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this examresult already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Examresult examresult, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new examresult", UsecaseList.ADD_EXAMRESULT);

        examresult.setTocreation(LocalDateTime.now());
        examresult.setCreator(authUser);
        examresult.setId(null);


        EntityValidator.validate(examresult);

        PersistHelper.save(()->{
            examresult.setCode(codeGenerator.getNextId(codeConfig));
            return examresultDao.save(examresult);
        });

        return new ResourceLink(examresult.getId(), "/examresults/"+examresult.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Examresult examresult, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update examresult details", UsecaseList.UPDATE_EXAMRESULT);

        Optional<Examresult> optionalExamresult = examresultDao.findById(id);
        if(optionalExamresult.isEmpty()) throw new ObjectNotFoundException("Examresult not found");
        Examresult oldExamresult = optionalExamresult.get();

        examresult.setId(id);
        examresult.setCode(oldExamresult.getCode());
        examresult.setCreator(oldExamresult.getCreator());
        examresult.setTocreation(oldExamresult.getTocreation());


        EntityValidator.validate(examresult);

        examresult = examresultDao.save(examresult);
        return new ResourceLink(examresult.getId(), "/examresults/"+examresult.getId());
    }

}