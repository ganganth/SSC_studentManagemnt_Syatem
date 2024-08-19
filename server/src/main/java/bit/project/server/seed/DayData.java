package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class DayData extends AbstractSeedClass {

    public DayData(){
        addIdNameData(1, "Monday");
        addIdNameData(2, "Tuesday");
        addIdNameData(3, "Wednesday");
        addIdNameData(4, "Thursday");
        addIdNameData(5, "Friday");
        addIdNameData(6, "Saturday");
        addIdNameData(7, "Sunday");
    }

}