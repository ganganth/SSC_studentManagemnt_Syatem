package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Payscheme;
import bit.project.server.dao.PayschemeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/payschemes")
public class PayschemeController{

    @Autowired
    private PayschemeDao payschemeDao;

    @GetMapping
    public List<Payscheme> getAll(){
        return payschemeDao.findAll();
    }
}