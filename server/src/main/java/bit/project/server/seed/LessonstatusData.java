package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class LessonstatusData extends AbstractSeedClass {

    public LessonstatusData(){
        addIdNameData(1, "Available");
        addIdNameData(2, "Discontinued");
    }

}