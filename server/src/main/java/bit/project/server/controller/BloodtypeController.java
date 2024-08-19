package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Bloodtype;
import bit.project.server.dao.BloodtypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/bloodtypes")
public class BloodtypeController{

    @Autowired
    private BloodtypeDao bloodtypeDao;

    @GetMapping
    public List<Bloodtype> getAll(){
        return bloodtypeDao.findAll();
    }
}