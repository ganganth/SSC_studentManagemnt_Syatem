package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
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
public class Sheduledate{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate date;

    private LocalTime tostart;

    private LocalTime toend;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Sheduledatestatus scheduledatestatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "sheduledate")
    private List<Clssession> sheduledateClssessionList;

    @JsonIgnore
    @OneToMany(mappedBy = "sheduledate")
    private List<Studentattendance> sheduledateStudentattendanceList;


    public Sheduledate(Integer id){
        this.id = id;
    }

    public Sheduledate(Integer id, String code, LocalDate date, LocalTime tostart, LocalTime toend, Sheduledatestatus scheduledatestatus){
        this.id = id;
        this.code = code;
        this.date = date;
        this.tostart = tostart;
        this.toend = toend;
        this.scheduledatestatus = scheduledatestatus;
    }

}