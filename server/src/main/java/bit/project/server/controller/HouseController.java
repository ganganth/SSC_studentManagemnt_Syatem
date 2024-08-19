package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.House;
import bit.project.server.dao.HouseDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/houses")
public class HouseController{

    @Autowired
    private HouseDao houseDao;

    @GetMapping
    public List<House> getAll(){
        return houseDao.findAll();
    }
}