package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
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
public class Material{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private String file;

    private LocalDate date;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Subject subject;

    @ManyToOne
    private Lesson lesson;

    @ManyToOne
    private Employee employee;

    @ManyToOne
    private Materialmedium materialmedium;

    @ManyToOne
    private Materialstatus materialstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Materialissue> materialMaterialissueList;


    public Material(Integer id){
        this.id = id;
    }

    public Material(Integer id, String code, String name){
        this.id = id;
        this.code = code;
        this.name = name;
    }

}