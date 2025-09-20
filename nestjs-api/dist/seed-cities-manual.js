"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const country_entity_1 = require("./country/country.entity");
const city_entity_1 = require("./city/city.entity");
(0, dotenv_1.config)();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'nestjs_db',
    entities: [country_entity_1.Country, city_entity_1.City],
    synchronize: false,
});
const majorCities = {
    'IRN': ['Tehran', 'Mashhad', 'Isfahan', 'Shiraz', 'Tabriz', 'Karaj', 'Ahvaz', 'Qom', 'Kermanshah', 'Urmia'],
    'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
    'GBR': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Leicester'],
    'DEU': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
    'FRA': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
    'CAN': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
    'AUS': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong'],
    'JPN': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kawasaki', 'Kyoto', 'Saitama'],
    'CHN': ['Shanghai', 'Beijing', 'Shenzhen', 'Guangzhou', 'Tianjin', 'Wuhan', 'Dongguan', 'Chengdu', 'Nanjing', 'Chongqing'],
    'IND': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur'],
    'BRA': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Goiânia'],
    'RUS': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don'],
    'TUR': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır'],
    'EGY': ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Mansoura', 'El Mahalla El Kubra', 'Tanta'],
    'SAU': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Dhahran', 'Taif', 'Buraidah', 'Tabuk'],
    'ARE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
    'KWT': ['Kuwait City', 'Al Ahmadi', 'Hawalli', 'Al Farwaniyah', 'Al Jahra', 'Mubarak Al-Kabeer'],
    'QAT': ['Doha', 'Al Rayyan', 'Al Wakrah', 'Al Khor', 'Umm Salal', 'Al Daayen'],
    'BHR': ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'A\'ali', 'Isa Town'],
    'OMN': ['Muscat', 'Seeb', 'Salalah', 'Bawshar', 'Sohar', 'Sur', 'Nizwa', 'Ibri'],
    'JOR': ['Amman', 'Zarqa', 'Irbid', 'Russeifa', 'Wadi as-Sir', 'Aqaba', 'Salt', 'Madaba'],
    'LBN': ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Zahle', 'Baalbek', 'Jounieh', 'Nabatieh'],
    'SYR': ['Damascus', 'Aleppo', 'Homs', 'Hama', 'Latakia', 'Deir ez-Zor', 'Raqqa', 'Tartus'],
    'IRQ': ['Baghdad', 'Basra', 'Mosul', 'Erbil', 'Najaf', 'Karbala', 'Nasiriyah', 'Fallujah'],
    'AFG': ['Kabul', 'Kandahar', 'Herat', 'Mazar-i-Sharif', 'Jalalabad', 'Kunduz', 'Ghazni', 'Balkh'],
    'PAK': ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Peshawar'],
    'BGD': ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Comilla'],
    'LKA': ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Galle', 'Matale', 'Negombo', 'Anuradhapura'],
    'NPL': ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bharatpur', 'Biratnagar', 'Birgunj', 'Janakpur', 'Hetauda'],
    'BTN': ['Thimphu', 'Phuntsholing', 'Paro', 'Gelephu', 'Samdrup Jongkhar', 'Trashigang', 'Wangdue Phodrang'],
    'MDV': ['Malé', 'Addu City', 'Fuvahmulah', 'Kulhudhuffushi', 'Thinadhoo', 'Naifaru', 'Eydhafushi'],
    'MYA': ['Yangon', 'Mandalay', 'Naypyidaw', 'Mawlamyine', 'Taunggyi', 'Monywa', 'Meiktila', 'Sittwe'],
    'THA': ['Bangkok', 'Nonthaburi', 'Nakhon Ratchasima', 'Chiang Mai', 'Hat Yai', 'Udon Thani', 'Khon Kaen', 'Ubon Ratchathani'],
    'LAO': ['Vientiane', 'Pakse', 'Savannakhet', 'Luang Prabang', 'Xam Neua', 'Phonsavan', 'Thakhek', 'Muang Xay'],
    'KHM': ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kampong Cham', 'Kampong Thom', 'Kampot', 'Kratie'],
    'VNM': ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho', 'Bien Hoa', 'Hue', 'Nha Trang'],
    'MYS': ['Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Klang', 'Johor Bahru', 'Subang Jaya'],
    'SGP': ['Singapore'],
    'IDN': ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang', 'Tangerang'],
    'PHL': ['Quezon City', 'Manila', 'Caloocan', 'Davao City', 'Cebu City', 'Zamboanga City', 'Antipolo', 'Pasig'],
    'BRN': ['Bandar Seri Begawan', 'Kuala Belait', 'Seria', 'Tutong', 'Bangar', 'Kampong Ayer'],
    'TLS': ['Dili', 'Baucau', 'Maliana', 'Suai', 'Liquiçá', 'Aileu', 'Manatuto', 'Viqueque'],
    'MMR': ['Yangon', 'Mandalay', 'Naypyidaw', 'Mawlamyine', 'Taunggyi', 'Monywa', 'Meiktila', 'Sittwe'],
    'MNG': ['Ulaanbaatar', 'Darkhan', 'Erdenet', 'Choibalsan', 'Mörön', 'Khovd', 'Ölgii', 'Bayankhongor'],
    'KOR': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan'],
    'PRK': ['Pyongyang', 'Hamhung', 'Chongjin', 'Nampo', 'Wonsan', 'Sinuiju', 'Tanchon', 'Kaechon'],
    'TWN': ['Taipei', 'Kaohsiung', 'Taichung', 'Tainan', 'Banqiao', 'Hsinchu', 'Taoyuan', 'Keelung'],
    'HKG': ['Hong Kong'],
    'MAC': ['Macau']
};
async function seedCitiesManually() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connection established');
        const countryRepository = AppDataSource.getRepository(country_entity_1.Country);
        const cityRepository = AppDataSource.getRepository(city_entity_1.City);
        const countries = await countryRepository.find();
        console.log(`📊 Found ${countries.length} countries`);
        let totalCitiesAdded = 0;
        for (const country of countries) {
            const citiesForCountry = majorCities[country.iso_code];
            if (citiesForCountry) {
                console.log(`🏙️ Adding cities for ${country.name} (${country.iso_code})`);
                for (const cityName of citiesForCountry) {
                    const existingCity = await cityRepository.findOne({
                        where: {
                            name: cityName,
                            country_id: country.id
                        }
                    });
                    if (!existingCity) {
                        const cityData = {
                            name: cityName,
                            country_id: country.id,
                            latitude: undefined,
                            longitude: undefined,
                            population: undefined,
                            state_province: undefined,
                            timezone: undefined,
                        };
                        const city = cityRepository.create(cityData);
                        await cityRepository.save(city);
                        totalCitiesAdded++;
                    }
                }
            }
            else {
                console.log(`⚠️ No cities defined for ${country.name} (${country.iso_code})`);
            }
        }
        console.log(`✅ Cities seeding completed! Added ${totalCitiesAdded} cities`);
        const finalCityCount = await cityRepository.count();
        console.log(`📊 Total cities in database: ${finalCityCount}`);
    }
    catch (error) {
        console.error('❌ Error seeding cities:', error);
    }
    finally {
        await AppDataSource.destroy();
    }
}
seedCitiesManually();
//# sourceMappingURL=seed-cities-manual.js.map