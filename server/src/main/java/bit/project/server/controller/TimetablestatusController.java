package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Timetablestatus;
import bit.project.server.dao.TimetablestatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/timetablestatuses")
public class TimetablestatusController{

    @Autowired
    private TimetablestatusDao timetablestatusDao;

    @GetMapping
    public List<Timetablestatus> getAll(){
        return timetablestatusDao.findAll();
    }
}