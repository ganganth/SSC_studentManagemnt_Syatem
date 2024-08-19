package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class GradeyearstatusData extends AbstractSeedClass {

    public GradeyearstatusData(){
        addIdNameData(1, "Active");
        addIdNameData(2, "Finished");
        addIdNameData(3, "Cancelled");
    }

}