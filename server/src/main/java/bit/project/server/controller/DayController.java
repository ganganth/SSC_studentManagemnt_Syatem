package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Day;
import bit.project.server.dao.DayDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/days")
public class DayController{

    @Autowired
    private DayDao dayDao;

    @GetMapping
    public List<Day> getAll(){
        return dayDao.findAll();
    }
}


