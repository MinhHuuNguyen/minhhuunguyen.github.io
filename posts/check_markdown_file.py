import os
import frontmatter
import pandas as pd


def read_markdown_files(directory):
    markdown_data = []
    
    for root, _, files in os.walk(directory):
        for file in files:
            if not file.endswith(".md"): continue
            if "_venv/.venv/" in root: continue
            if file in ["README.md"]: continue
            # print(root, file)
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                post = frontmatter.loads(f.read())
                metadata = post.metadata
                metadata["file_name"] = file_path.split('/')[-1]
                metadata["file_path"] = file_path
                markdown_data.append(metadata)
    
    return pd.DataFrame(markdown_data)  # Convert to pandas DataFrame

# Example usage:
directory_path = "."  # Change this to your target directory
md_df = read_markdown_files(directory_path)
md_df = md_df[['time', 'file_name', 'is_published', 'title', 'file_path']]
md_df['time'] = pd.to_datetime(md_df['time'])
md_df = md_df.sort_values(by='time', ascending=True)
md_df = md_df.reset_index(drop=True)

# Print dataframe
print(md_df)

# Print rows whose time is same
duplicate_times = md_df[md_df.duplicated(subset=['time'], keep=False)]
print("Duplicate time entries:")
print(duplicate_times)

md_df.to_csv('posts.csv')


# 20230506
# [DWDL23A4L1] 20230508 - Buổi 3
# 20230513
# [DWDL23A4L1] 20230515 - Buổi 5
# 20230520
# [DWDL23A4L1] 20230522 - Buổi 7
# [DWDL23A4L1] 20230529 - Buổi 8
# [DWDL23A4L1] 20230602 - Buổi 9
# [DWDL23A4L1] 20230605 - Buổi 10


# [PROTONX-2] 20240710 - Buổi 14
# [PROTONX-2] 20240708 - Buổi 13
# [PROTONX-2] 20240703 - Buổi 12
# [PROTONX-2] 20240701 - Buổi 11
# [PROTONX-2] 20240626 - Buổi 10
# [PROTONX-2] 20240624 - Buổi 9
# [PROTONX-2] 20240619 - Buổi 8
# [PROTONX-2] 20240617 - Buổi 7
# [PROTONX-2] 20240612 - Buổi 6
# [PROTONX-2] 20240610 - Buổi 5
# [PROTONX-2] 20240605 - Buổi 4
# [PROTONX-2] 20240603 - Buổi 3
# [PROTONX-2] 20240527 - Buổi 2
# [PROTONX-2] 20240522 - Buổi 1

# [PROTONX-1] 20240116 - Buổi 15
# [PROTONX-1] 20240112 - Buổi 14
# [PROTONX-1] 20240109 - Buổi 13
# [PROTONX-1] 20240105 - Buổi 12
# [PROTONX-1] 20240102 - Buổi 11
# [PROTONX-1] 20231229 - Buổi 10
# [PROTONX-1] 20231226 - Buổi 9
# [PROTONX-1] 20231219 - Buổi 8

# 01/10/2023
# 12/05/2023
# 12/08/2023
# 12/12/2023
# 12/15/2023
