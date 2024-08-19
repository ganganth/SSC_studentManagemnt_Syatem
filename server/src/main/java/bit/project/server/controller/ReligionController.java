package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Religion;
import bit.project.server.dao.ReligionDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/religions")
public class ReligionController{

    @Autowired
    private ReligionDao religionDao;

    @GetMapping
    public List<Religion> getAll(){
        return religionDao.findAll();
    }
}