import json

SEED_FILE = "supabase/seed/sleep_reset_section_1.sql"

def main():
    print("Reading seed file...")
    with open(SEED_FILE, "r") as f:
        content = f.read()

    start_str = "FROM jsonb_to_recordset('["
    end_str = "]'::jsonb) AS row("

    # Find the exercises array dynamically by looking for a known node
    idx = content.find(start_str)
    found = False
    while idx != -1:
        end_idx = content.find(end_str, idx)
        json_part = content[idx+len("FROM jsonb_to_recordset('"):end_idx+1]
        if '"node_source_id":"u1_1_sleep_mechanics-n1"' in json_part:
            found = True
            break
        idx = content.find(start_str, idx + 1)

    if not found:
        print("Failed to find exercises array.")
        return

    print("Found exercises array. Parsing JSON...")
    
    json_str = json_part.replace("''", "'")
    data = json.loads(json_str)
    
    print(f"Total exercises before audit: {len(data)}")
    
    new_data = []
    deleted_ids = []
    
    # Organize by node_source_id for sequential order_index re-indexing
    nodes = {}
    
    for item in data:
        nid = item.get("node_source_id")
        t = item.get("type")
        source_id = item.get("source_id")
        
        keep = True
        
        if nid == "u1_1_sleep_mechanics-n2":
            if t not in ["concept_card", "learn_cards"]:
                keep = False
        
        elif nid == "u1_1_sleep_mechanics-n3":
            if t not in ["evening_comparison", "annotated_diary"]:
                keep = False
                
        elif nid == "u1_2_sleep_disruptors-n1":
            if t not in ["layer_zoom", "story_walkthrough", "course_choice"]:
                keep = False
                
        elif nid == "u1_2_sleep_disruptors-n2":
            # keep evidence_bite, what_if_machine, course_choice
            if t not in ["evidence_bite", "what_if_machine", "course_choice"]:
                keep = False
                
        elif nid == "u1_2_sleep_disruptors-n3":
            if t in ["private_check", "twin_case"]:
                keep = False
                
        elif nid == "u1_2_sleep_disruptors-n4":
            if t not in ["layer_zoom", "evidence_bite", "course_choice"]:
                keep = False
                
        elif nid == "u1_2_sleep_disruptors-n6_experiment":
            # Retain if_then_plan, evidence_bite, twin_case
            if t not in ["twin_case", "evidence_bite", "if_then_plan"]:
                keep = False
        
        if keep:
            if nid not in nodes:
                nodes[nid] = []
            nodes[nid].append(item)
        else:
            deleted_ids.append(source_id)
            
    # Re-index
    for nid, items in nodes.items():
        items.sort(key=lambda x: x.get("order_index", 0))
        for i, item in enumerate(items):
            item["order_index"] = i
            new_data.append(item)
            
    print(f"Total exercises after audit: {len(new_data)}")
    print(f"Deleted {len(deleted_ids)} exercises.")
    
    # Replace JSON
    new_json_str = json.dumps(new_data, separators=(',', ':')).replace("'", "''")
    new_content = content[:idx+len("FROM jsonb_to_recordset('")] + new_json_str + content[end_idx:]
    
    # Append DELETE statement
    if deleted_ids:
        delete_sql = "\n\n-- Cleanup removed exercises for Section 1 Cognitive Load Audit\nDELETE FROM exercises WHERE id IN (\n"
        delete_sql += ",\n".join([f"  pg_temp.seed_uuid('{sid}')" for sid in deleted_ids])
        delete_sql += "\n);\n"
        
        # Check if already present to prevent duplicate appending
        if "-- Cleanup removed exercises for Section 1 Cognitive Load Audit" not in new_content:
            new_content += delete_sql
            
    with open(SEED_FILE, "w") as f:
        f.write(new_content)
        
    print("Successfully updated seed file.")

if __name__ == "__main__":
    main()
