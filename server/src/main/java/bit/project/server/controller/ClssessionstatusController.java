package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Clssessionstatus;
import bit.project.server.dao.ClssessionstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/clssessionstatuses")
public class ClssessionstatusController{

    @Autowired
    private ClssessionstatusDao clssessionstatusDao;

    @GetMapping
    public List<Clssessionstatus> getAll(){
        return clssessionstatusDao.findAll();
    }
}