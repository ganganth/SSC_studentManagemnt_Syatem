package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Ethnicity;
import bit.project.server.dao.EthnicityDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/ethnicities")
public class EthnicityController{

    @Autowired
    private EthnicityDao ethnicityDao;

    @GetMapping
    public List<Ethnicity> getAll(){
        return ethnicityDao.findAll();
    }
}