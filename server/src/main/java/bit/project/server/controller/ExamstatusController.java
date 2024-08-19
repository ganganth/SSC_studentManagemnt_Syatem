package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Examstatus;
import bit.project.server.dao.ExamstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/examstatuses")
public class ExamstatusController{

    @Autowired
    private ExamstatusDao examstatusDao;

    @GetMapping
    public List<Examstatus> getAll(){
        return examstatusDao.findAll();
    }
}