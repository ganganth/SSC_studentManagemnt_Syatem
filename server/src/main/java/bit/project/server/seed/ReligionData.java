package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ReligionData extends AbstractSeedClass {

    public ReligionData(){
        addIdNameData(1, "Buddhist");
        addIdNameData(2, "Catholic");
        addIdNameData(3, "Muslim");
    }

}