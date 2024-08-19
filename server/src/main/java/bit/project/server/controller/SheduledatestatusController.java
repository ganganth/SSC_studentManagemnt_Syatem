package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Sheduledatestatus;
import bit.project.server.dao.SheduledatestatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/sheduledatestatuses")
public class SheduledatestatusController{

    @Autowired
    private SheduledatestatusDao sheduledatestatusDao;

    @GetMapping
    public List<Sheduledatestatus> getAll(){
        return sheduledatestatusDao.findAll();
    }
}