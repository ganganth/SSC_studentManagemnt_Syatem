package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Subjectstatus;
import bit.project.server.dao.SubjectstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/subjectstatuses")
public class SubjectstatusController{

    @Autowired
    private SubjectstatusDao subjectstatusDao;

    @GetMapping
    public List<Subjectstatus> getAll(){
        return subjectstatusDao.findAll();
    }
}