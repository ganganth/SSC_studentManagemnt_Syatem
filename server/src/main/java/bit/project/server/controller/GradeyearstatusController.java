package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Gradeyearstatus;
import bit.project.server.dao.GradeyearstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/gradeyearstatuses")
public class GradeyearstatusController{

    @Autowired
    private GradeyearstatusDao gradeyearstatusDao;

    @GetMapping
    public List<Gradeyearstatus> getAll(){
        return gradeyearstatusDao.findAll();
    }
}