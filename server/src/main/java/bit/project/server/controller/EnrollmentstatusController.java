package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Enrollmentstatus;
import bit.project.server.dao.EnrollmentstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/enrollmentstatuses")
public class EnrollmentstatusController{

    @Autowired
    private EnrollmentstatusDao enrollmentstatusDao;

    @GetMapping
    public List<Enrollmentstatus> getAll(){
        return enrollmentstatusDao.findAll();
    }
}