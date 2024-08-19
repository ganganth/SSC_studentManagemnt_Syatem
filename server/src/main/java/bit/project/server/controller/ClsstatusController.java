package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Clsstatus;
import bit.project.server.dao.ClsstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/clsstatuses")
public class ClsstatusController{

    @Autowired
    private ClsstatusDao clsstatusDao;

    @GetMapping
    public List<Clsstatus> getAll(){
        return clsstatusDao.findAll();
    }
}