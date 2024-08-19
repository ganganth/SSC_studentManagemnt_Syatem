package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Materialmedium;
import bit.project.server.dao.MaterialmediumDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/materialmediums")
public class MaterialmediumController{

    @Autowired
    private MaterialmediumDao materialmediumDao;

    @GetMapping
    public List<Materialmedium> getAll(){
        return materialmediumDao.findAll();
    }
}