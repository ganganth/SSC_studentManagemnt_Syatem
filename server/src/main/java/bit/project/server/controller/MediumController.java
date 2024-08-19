package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Medium;
import bit.project.server.dao.MediumDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/mediums")
public class MediumController{

    @Autowired
    private MediumDao mediumDao;

    @GetMapping
    public List<Medium> getAll(){
        return mediumDao.findAll();
    }
}