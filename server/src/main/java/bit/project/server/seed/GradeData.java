package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class GradeData extends AbstractSeedClass {

    public GradeData(){
        addIdNameData(1, "Grade 1");
        addIdNameData(2, "Grade 2");
        addIdNameData(3, "Grade 3");
        addIdNameData(4, "Grade 4");
        addIdNameData(5, "Grade 5");
    }

}