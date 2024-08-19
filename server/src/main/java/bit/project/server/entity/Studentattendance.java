package bit.project.server.entity;

import lombok.Data;
import javax.persistence.*;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Studentattendance{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private Boolean attend;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Student student;

    @ManyToOne
    private Cls cls;

    @ManyToOne
    private Sheduledate sheduledate;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Studentattendance(Integer id){
        this.id = id;
    }

    public Studentattendance(Integer id, String code, Student student){
        this.id = id;
        this.code = code;
        this.student = student;
    }

}