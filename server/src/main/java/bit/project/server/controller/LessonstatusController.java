package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Lessonstatus;
import bit.project.server.dao.LessonstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/lessonstatuses")
public class LessonstatusController{

    @Autowired
    private LessonstatusDao lessonstatusDao;

    @GetMapping
    public List<Lessonstatus> getAll(){
        return lessonstatusDao.findAll();
    }
}