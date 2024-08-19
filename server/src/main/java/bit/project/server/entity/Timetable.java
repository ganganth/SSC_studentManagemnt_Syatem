package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalTime;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Timetable{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    @Lob
    private String description;

    private LocalTime tostart;

    private LocalTime toend;

    private LocalDateTime tocreation;


    @ManyToOne
    private Grade grade;

    @ManyToOne
    private Gradeyear gradeyear;

    @ManyToOne
    private Subject subject;

    @ManyToOne
    private Employee teacher;

    @ManyToOne
    private Day day;

    @ManyToOne
    private Cls cls;

    @ManyToOne
    private Timetablestatus timetablestatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "timetable")
    private List<Clssession> timetableClssessionList;


    public Timetable(Integer id){
        this.id = id;
    }

    public Timetable(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}