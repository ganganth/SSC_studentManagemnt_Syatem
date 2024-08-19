package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Studentstatus;
import bit.project.server.dao.StudentstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/studentstatuses")
public class StudentstatusController{

    @Autowired
    private StudentstatusDao studentstatusDao;

    @GetMapping
    public List<Studentstatus> getAll(){
        return studentstatusDao.findAll();
    }
}