import math
import statistics

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0)**2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2.0)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def bearing(lat1, lon1, lat2, lon2):
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_lambda = math.radians(lon2 - lon1)
    y = math.sin(delta_lambda) * math.cos(phi2)
    x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
    theta = math.atan2(y, x)
    return (math.degrees(theta) + 360) % 360

ESTABLISHMENTS = [
    {"id": "cha-chas-kinalas", "name": "Cha Cha's Kinalas", "lat": 13.6264, "lon": 123.1842, "mapX": 42, "mapY": 48, "dist": 0.4},
    {"id": "aling-celys-kinalasan", "name": "Aling Cely's Kinalasan", "lat": 13.6268, "lon": 123.1848, "mapX": 43, "mapY": 47, "dist": 0.5},
    {"id": "cha-kamot-kinalas", "name": "Cha Kamot", "lat": 13.6295, "lon": 123.1908, "mapX": 56, "mapY": 41, "dist": 1.1},
    {"id": "geewan-bicolano-eatery", "name": "Geewan", "lat": 13.6241, "lon": 123.1821, "mapX": 36, "mapY": 54, "dist": 0.2},
    {"id": "naga-peoples-mall-stalls", "name": "Naga People's Mall", "lat": 13.6219, "lon": 123.1805, "mapX": 30, "mapY": 60, "dist": 0.5},
    {"id": "biggs-diner-centro", "name": "Bigg's Diner (Centro)", "lat": 13.6225, "lon": 123.1818, "mapX": 38, "mapY": 56, "dist": 0.3},
    {"id": "biggs-diner-magsaysay", "name": "Bigg's Diner (Magsaysay)", "lat": 13.6292, "lon": 123.1965, "mapX": 70, "mapY": 44, "dist": 1.4},
    {"id": "bob-marlin-restaurant", "name": "Bob Marlin", "lat": 13.6305, "lon": 123.1985, "mapX": 74, "mapY": 42, "dist": 1.6},
    {"id": "red-platter", "name": "Red Platter", "lat": 13.6301, "lon": 123.1978, "mapX": 72, "mapY": 43, "dist": 1.5},
    {"id": "chef-doys-restaurant", "name": "Chef Doy's", "lat": 13.6312, "lon": 123.1992, "mapX": 76, "mapY": 41, "dist": 1.7},
    {"id": "3n-bakery-triangulo", "name": "3N Bakery", "lat": 13.6205, "lon": 123.1912, "mapX": 58, "mapY": 64, "dist": 0.9},
    {"id": "pan-de-naga-heritage", "name": "Pan De Naga", "lat": 13.6245, "lon": 123.1835, "mapX": 45, "mapY": 52, "dist": 0.3},
    {"id": "bakers-plaza-naga", "name": "Baker's Plaza", "lat": 13.6238, "lon": 123.1932, "mapX": 62, "mapY": 62, "dist": 0.8},
    {"id": "j-emanuel-pili", "name": "J. Emmanuel Pastries", "lat": 13.6212, "lon": 123.2045, "mapX": 82, "mapY": 68, "dist": 2.1},
]

TRAILS = [
    {
        "id": "trail-barlin-kinalas",
        "title": "Trail 1: Barlin & Dayangdang Kinalas Crawl",
        "stated_total_km": 1.3,
        "stated_duration": "60–75 mins",
        "legs": [
            {
                "from": "Aling Cely's", "to": "Cha Cha's",
                "from_coord": (13.6268, 123.1848), "to_coord": (13.6264, 123.1842),
                "claimed_m": 120, "claimed_mins": 2
            },
            {
                "from": "Cha Cha's", "to": "Cha Kamot",
                "from_coord": (13.6264, 123.1842), "to_coord": (13.6295, 123.1908),
                "claimed_m": 850, "claimed_mins": 11
            }
        ]
    },
    {
        "id": "trail-centro-heritage",
        "title": "Trail 2: Centro & Downtown Heritage Food Trail",
        "stated_total_km": 1.6,
        "stated_duration": "75–90 mins",
        "legs": [
            {
                "from": "People's Mall", "to": "Geewan",
                "from_coord": (13.6219, 123.1805), "to_coord": (13.6241, 123.1821),
                "claimed_m": 300, "claimed_mins": 4
            },
            {
                "from": "Geewan", "to": "Bigg's Centro",
                "from_coord": (13.6241, 123.1821), "to_coord": (13.6225, 123.1818),
                "claimed_m": 250, "claimed_mins": 3
            },
            {
                "from": "Bigg's Centro", "to": "Pan De Naga",
                "from_coord": (13.6225, 123.1818), "to_coord": (13.6245, 123.1835),
                "claimed_m": 200, "claimed_mins": 2
            }
        ]
    },
    {
        "id": "trail-magsaysay-strip",
        "title": "Trail 3: Magsaysay Food Strip",
        "stated_total_km": 1.8,
        "stated_duration": "90–120 mins",
        "legs": [
            {
                "from": "Bigg's Magsaysay", "to": "Red Platter",
                "from_coord": (13.6292, 123.1965), "to_coord": (13.6301, 123.1978),
                "claimed_m": 200, "claimed_mins": 3
            },
            {
                "from": "Red Platter", "to": "Chef Doy's",
                "from_coord": (13.6301, 123.1978), "to_coord": (13.6312, 123.1992),
                "claimed_m": 250, "claimed_mins": 3.5
            },
            {
                "from": "Chef Doy's", "to": "Bob Marlin",
                "from_coord": (13.6312, 123.1992), "to_coord": (13.6305, 123.1985),
                "claimed_m": 150, "claimed_mins": 2
            },
            {
                "from": "Bob Marlin", "to": "J. Emmanuel Pili",
                "from_coord": (13.6305, 123.1985), "to_coord": (13.6212, 123.2045),
                "claimed_m": 800, "claimed_mins": 10
            }
        ]
    },
    {
        "id": "trail-penafrancia-pilgrimage",
        "title": "Trail 4: Peñafrancia Pilgrimage & Riverside Flavors Trail",
        "stated_total_km": 2.8,
        "stated_duration": "120–150 mins",
        "legs": [
            {
                "from": "Naga Cathedral", "to": "Peñafrancia Shrine (Document)",
                "from_coord": (13.6283, 123.1872), "to_coord": (13.6308, 123.1895),
                "claimed_m": 800, "claimed_mins": 11
            },
            {
                "from": "Peñafrancia Shrine", "to": "Magsaysay Riverwalk",
                "from_coord": (13.6308, 123.1895), "to_coord": (13.6285, 123.1945),
                "claimed_m": 700, "claimed_mins": 9
            },
            {
                "from": "Magsaysay Riverwalk", "to": "Minor Basilica",
                "from_coord": (13.6285, 123.1945), "to_coord": (13.6319, 123.2000),
                "claimed_m": 1200, "claimed_mins": 15
            }
        ]
    }
]

def run_tests():
    print("=" * 70)
    print("CHALLENGER M2_1: EMPIRICAL GEOGRAPHICAL STRESS HARNESS")
    print("=" * 70)

    # 1. Establishments checks
    print("\n[TEST 1] Establishments Core Bounding Box & Coordinates Check")
    all_est_pass = True
    for e in ESTABLISHMENTS:
        in_bounds = (13.6100 <= e["lat"] <= 13.6400) and (123.1700 <= e["lon"] <= 123.2100)
        status = "PASS" if in_bounds else "FAIL"
        if not in_bounds:
            all_est_pass = False
        print(f"  [{status}] {e['name']}: ({e['lat']}, {e['lon']})")

    # 2. Map projection correlation
    print("\n[TEST 2] Map Projection Spatial Correlation Check")
    lons = [e["lon"] for e in ESTABLISHMENTS]
    mapXs = [e["mapX"] for e in ESTABLISHMENTS]
    lats = [e["lat"] for e in ESTABLISHMENTS]
    mapYs = [e["mapY"] for e in ESTABLISHMENTS]

    def corr(x, y):
        mx, my = statistics.mean(x), statistics.mean(y)
        num = sum((xi - mx) * (yi - my) for xi, yi in zip(x, y))
        den = math.sqrt(sum((xi - mx)**2 for xi in x) * sum((yi - my)**2 for yi in y))
        return num / den

    corr_x = corr(mapXs, lons)
    corr_y = corr(mapYs, lats)
    print(f"  mapX vs Longitude Pearson r: {corr_x:.4f} (Threshold > 0.95: {'PASS' if corr_x > 0.95 else 'FAIL'})")
    print(f"  mapY vs Latitude Pearson r: {corr_y:.4f} (Threshold < -0.90: {'PASS' if corr_y < -0.90 else 'FAIL'})")

    # 3. Physical distance integrity checks for trails
    print("\n[TEST 3] Physical Euclidean Feasibility on Claimed Trail Legs")
    failed_legs = []
    for t in TRAILS:
        print(f"\n  Checking: {t['title']}")
        for idx, l in enumerate(t["legs"], 1):
            h_m = haversine(l["from_coord"][0], l["from_coord"][1], l["to_coord"][0], l["to_coord"][1])
            is_feasible = l["claimed_m"] >= (h_m * 0.98) # allow 2% margin
            status = "PASS" if is_feasible else "FAIL_IMPOSSIBLE_SHORT"
            if not is_feasible:
                failed_legs.append((t["id"], idx, l["from"], l["to"], h_m, l["claimed_m"]))
            print(f"    Leg {idx} ({l['from']} -> {l['to']}): Haversine={h_m:.1f}m, Claimed={l['claimed_m']}m -> [{status}]")

    print("\n" + "=" * 70)
    print(f"SUMMARY: {len(failed_legs)} Physical Distance Violations Detected!")
    for f in failed_legs:
        print(f"  * Trail '{f[0]}' Leg {f[1]} ({f[2]} -> {f[3]}): Straight line = {f[4]:.1f}m > Claimed = {f[5]}m")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
