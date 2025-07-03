using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedUserEntity2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Users_AppUserId1",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_AppUserId1",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "AppUserId1",
                table: "Photos");

            migrationBuilder.AlterColumn<string>(
                name: "AppUserId",
                table: "Photos",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.CreateIndex(
                name: "IX_Photos_AppUserId",
                table: "Photos",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Users_AppUserId",
                table: "Photos",
                column: "AppUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Users_AppUserId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_AppUserId",
                table: "Photos");

            migrationBuilder.AlterColumn<int>(
                name: "AppUserId",
                table: "Photos",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<string>(
                name: "AppUserId1",
                table: "Photos",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Photos_AppUserId1",
                table: "Photos",
                column: "AppUserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Users_AppUserId1",
                table: "Photos",
                column: "AppUserId1",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
