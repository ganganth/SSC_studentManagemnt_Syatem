package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Guardianrelationship;
import bit.project.server.dao.GuardianrelationshipDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/guardianrelationships")
public class GuardianrelationshipController{

    @Autowired
    private GuardianrelationshipDao guardianrelationshipDao;

    @GetMapping
    public List<Guardianrelationship> getAll(){
        return guardianrelationshipDao.findAll();
    }
}