package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class TimetablestatusData extends AbstractSeedClass {

    public TimetablestatusData(){
        addIdNameData(1, "Ongoing");
        addIdNameData(2, "Finished");
    }

}