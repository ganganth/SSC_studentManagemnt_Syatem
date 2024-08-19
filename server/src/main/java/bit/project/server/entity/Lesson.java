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
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Lesson{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    @Lob
    private String description;

    private String name;

    private LocalDateTime tocreation;


    @ManyToOne
    private Grade grade;

    @ManyToOne
    private Subject subject;

    @ManyToOne
    private Lessonstatus lessonstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "lesson")
    private List<Material> lessonMaterialList;


    @JsonIgnore
    @ManyToMany(mappedBy = "lessonList")
    private List<Clssession> clssessionList;


    public Lesson(Integer id){
        this.id = id;
    }

    public Lesson(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}