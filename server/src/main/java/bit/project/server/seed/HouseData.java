package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class HouseData extends AbstractSeedClass {

    public HouseData(){
        addIdNameData(1, "A");
        addIdNameData(2, "B");
        addIdNameData(3, "C");
    }

}