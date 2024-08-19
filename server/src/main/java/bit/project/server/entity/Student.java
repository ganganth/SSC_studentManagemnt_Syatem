package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import java.math.BigDecimal;
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
public class Student{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String callingname;

    private String fullname;

    private String photo;

    private String birthcertificate;

    private LocalDate dobirth;

    private String nic;

    private String mobile;

    private String land;

    private String email;

    private LocalDate joineddate;

    @Lob
    private String address;

    private BigDecimal admissionfee;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Nametitle nametitle;

    @ManyToOne
    private Gender gender;

    @ManyToOne
    private Guardian guardian;

    @ManyToOne
    private Guardianrelationship guardianrelationship;

    @ManyToOne
    private Bloodtype bloodtype;

    @ManyToOne
    private Religion religion;

    @ManyToOne
    private Ethnicity ethnicity;

    @ManyToOne
    private House house;

    @ManyToOne
    private Studentstatus studentstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "monitor")
    private List<Cls> monitorClsList;

    @JsonIgnore
    @OneToMany(mappedBy = "vicemonitor")
    private List<Cls> vicemonitorClsList;

    @JsonIgnore
    @OneToMany(mappedBy = "student")
    private List<Enrollment> studentEnrollmentList;

    @JsonIgnore
    @OneToMany(mappedBy = "student")
    private List<Examresult> studentExamresultList;

    @JsonIgnore
    @OneToMany(mappedBy = "student")
    private List<Materialissue> studentMaterialissueList;

    @JsonIgnore
    @OneToMany(mappedBy = "student")
    private List<Studentattendance> studentStudentattendanceList;

    @JsonIgnore
    @OneToMany(mappedBy = "student")
    private List<Studentpayment> studentStudentpaymentList;


    @JsonIgnore
    @ManyToMany(mappedBy = "studentList")
    private List<Cls> clsList;


    public Student(Integer id){
        this.id = id;
    }

    public Student(Integer id, String code, Nametitle nametitle, String callingname, String photo, String birthcertificate){
        this.id = id;
        this.code = code;
        this.nametitle = nametitle;
        this.callingname = callingname;
        this.photo = photo;
        this.birthcertificate = birthcertificate;
    }

    public Student(Integer id, String code, String callingname) {
        this.id = id;
        this.code = code;
        this.callingname = callingname;
    }
}
