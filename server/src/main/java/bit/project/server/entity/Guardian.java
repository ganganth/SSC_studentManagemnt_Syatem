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
public class Guardian{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String callingname;

    private String fullname;

    private String nic;

    private String mobile;

    private String land;

    private String email;

    private String occupation;

    @Lob
    private String address;

    private String officetel1;

    private String officetel2;

    @Lob
    private String officeaddress;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Nametitle nametitle;

    @ManyToOne
    private Civilstatus civilstatus;

    @ManyToOne
    private Gender gender;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "guardian")
    private List<Student> guardianStudentList;


    public Guardian(Integer id){
        this.id = id;
    }

    public Guardian(Integer id, String code, Nametitle nametitle, String callingname){
        this.id = id;
        this.code = code;
        this.nametitle = nametitle;
        this.callingname = callingname;
    }

}