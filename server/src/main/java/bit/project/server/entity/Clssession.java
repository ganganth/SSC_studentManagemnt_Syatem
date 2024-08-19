package bit.project.server.entity;

import lombok.Data;
import java.util.List;
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
public class Clssession{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Cls cls;

    @ManyToOne
    private Grade grade;

    @ManyToOne
    private Timetable timetable;

    @ManyToOne
    private Clssessionstatus clssessionstatus;

    @ManyToOne
    private Sheduledate sheduledate;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @ManyToMany
        @JoinTable(
        name="clssessionlesson",
        joinColumns=@JoinColumn(name="clssession_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="lesson_id", referencedColumnName="id")
    )
    private List<Lesson> lessonList;


    public Clssession(Integer id){
        this.id = id;
    }

    public Clssession(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}