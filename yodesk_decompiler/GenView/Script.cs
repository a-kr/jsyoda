using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GenView
{
    class Script
    {

        public static readonly ScriptConditionSignature[] SCRIPT_CONDITION = {
            new ScriptConditionSignature{Name = "FirstEnter", Args = new string[]{}},
            new ScriptConditionSignature{Name = "Enter", Args = new string[]{}},
            new ScriptConditionSignature{Name = "BumpTile", Args = new string[]{"x", "y", "tile"}},
            new ScriptConditionSignature{Name = "DragItem", Args = new string[]{"x", "y", "layer", "tile", "item"}},
            new ScriptConditionSignature{Name = "Walk", Args = new string[]{"x", "y"}},
            new ScriptConditionSignature{Name = "TempVarEq", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "RandVarEq", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "RandVarGt", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "RandVarLs", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "EnterVehicle", Args = new string[]{}},
            new ScriptConditionSignature{Name = "CheckMapTile", Args = new string[]{"value", "x", "y", "layer"}},
            new ScriptConditionSignature{Name = "EnemyDead", Args = new string[]{"enemy_id"}},
            new ScriptConditionSignature{Name = "AllEnemiesDead",  Args = new string[]{}},
            new ScriptConditionSignature{Name = "HasItem", Args = new string[]{"item"}},
            new ScriptConditionSignature{Name = "HasEndItem", Args = new string[]{"item"}},
            new ScriptConditionSignature{Name = "Unk0f", Args = new string[]{}},
            new ScriptConditionSignature{Name = "Unk10", Args = new string[]{}},
            new ScriptConditionSignature{Name = "GameInProgress?", Args = new string[]{}},
            new ScriptConditionSignature{Name = "GameCompleted?", Args = new string[]{}},
            new ScriptConditionSignature{Name = "HealthLs", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "HealthGt", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "Unk15", Args = new string[]{}},
            new ScriptConditionSignature{Name = "Unk16", Args = new string[]{}},
            new ScriptConditionSignature{Name = "DragWrongItem", Args = new string[]{"x", "y", "layer", "tile", "item"}},
            new ScriptConditionSignature{Name = "PlayerAtPos", Args = new string[]{"x", "y"}},
            new ScriptConditionSignature{Name = "GlobalVarEq", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "GlobalVarLs", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "GlobalVarGt", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "ExperienceEq", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "Unk1d", Args = new string[]{}},
            new ScriptConditionSignature{Name = "Unk1e", Args = new string[]{}},
            new ScriptConditionSignature{Name = "TempVarNe", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "RandVarNe", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "GlobalVarNe", Args = new string[]{"value"}},
            new ScriptConditionSignature{Name = "CheckMapTileVar", Args = new string[]{"value", "x", "y", "layer"}},
            new ScriptConditionSignature{Name = "ExperienceGt", Args = new string[]{"value"}},
        };



        public static readonly ScriptActionSignature[] SCRIPT_ACTION = {
            new ScriptActionSignature{Name = "SetMapTile", Args = new string[]{"x", "y", "layer", "tile"}},
            new ScriptActionSignature{Name = "ClearTile", Args = new string[]{"x", "y", "layer"}},
            new ScriptActionSignature{Name = "MoveMapTile", Args = new string[]{"from_x", "from_y", "layer", "to_x", "to_y"}},
            new ScriptActionSignature{Name = "DrawOverlayTile", Args = new string[]{"x", "y", "tile"}},
            new ScriptActionSignature{Name = "SayText", Args = new string[]{"x", "y"}},
            new ScriptActionSignature{Name = "ShowText", Args = new string[]{"x", "y"}},
            new ScriptActionSignature{Name = "RedrawTile", Args = new string[]{"x", "y"}},
            new ScriptActionSignature{Name = "RedrawTiles", Args = new string[]{"x1", "y1", "x2", "y2"}},
            new ScriptActionSignature{Name = "RenderChanges", Args = new string[]{"unk"}},
            new ScriptActionSignature{Name = "Sleep", Args = new string[]{"seconds"}},
            new ScriptActionSignature{Name = "PlaySound", Args = new string[]{"sound_id"}},
            new ScriptActionSignature{Name = "Unk0b", Args = new string[]{}},
            new ScriptActionSignature{Name = "Random", Args = new string[]{"rand_max"}},
            new ScriptActionSignature{Name = "SetTempVar", Args = new string[]{"value"}},
            new ScriptActionSignature{Name = "AddTempVar", Args = new string[]{"value"}},
            new ScriptActionSignature{Name = "SetMapTileVar", Args = new string[]{"x", "y", "layer", "value"}},
            new ScriptActionSignature{Name = "ReleaseCamera", Args = new string[]{}},
            new ScriptActionSignature{Name = "LockCamera", Args = new string[]{}},
            new ScriptActionSignature{Name = "SetPlayerPos", Args = new string[]{"x", "y"}},
            new ScriptActionSignature{Name = "MoveCamera", Args = new string[]{"x1", "y1", "x2", "y2", "time"}},
            new ScriptActionSignature{Name = "Redraw", Args = new string[]{}},
            new ScriptActionSignature{Name = "OpenDoor", Args = new string[]{"door_num"}},
            new ScriptActionSignature{Name = "CloseDoor", Args = new string[]{"door_num"}},
            new ScriptActionSignature{Name = "EnemySpawn", Args = new string[]{"enemy"}},
            new ScriptActionSignature{Name = "NPCSpawn", Args = new string[]{"npc"}},
            new ScriptActionSignature{Name = "RemoveDraggedItem", Args = new string[]{}},
            new ScriptActionSignature{Name = "RemoveDraggedItemSimilar", Args = new string[]{}},
            new ScriptActionSignature{Name = "SpawnItem", Args = new string[]{"item", "x", "y"}},
            new ScriptActionSignature{Name = "AddItemToInv", Args = new string[]{"item"}},
            new ScriptActionSignature{Name = "DropItem", Args = new string[]{"item"}},
            new ScriptActionSignature{Name = "OpenSomething1e", Args = new string[]{}},
            new ScriptActionSignature{Name = "Unk1f", Args = new string[]{}},
            new ScriptActionSignature{Name = "Unk20", Args = new string[]{}},
            new ScriptActionSignature{Name = "WarpToMap", Args = new string[]{"zone", "x", "y", "unk"}},
            new ScriptActionSignature{Name = "SetGlobalVar", Args = new string[]{"value"}},
            new ScriptActionSignature{Name = "AddGlobalVar", Args = new string[]{"value"}},
            new ScriptActionSignature{Name = "SetRandVar", Args = new string[]{"value"}},
            new ScriptActionSignature{Name = "AddHealth", Args = new string[]{"value"}},

        };

    }

    public struct ScriptConditionSignature
    {
        public string Name;
        public string[] Args;
    }

    public struct ScriptActionSignature
    {
        public string Name;
        public string[] Args;
    }

    public class Iact : YodaDeserializable
    {
        public ScriptCondition[] Conditions;
        public ScriptAction[] Actions;

        public void Deserialize(YodaReader stream)
        {
            int n;
            stream.ExpectAtCurrentPos("IACT");
            stream.ReadN(4);
            stream.ReadLong(); // length
            n = stream.ReadShort();
            this.Conditions = stream.ReadObjectArray<ScriptCondition>(n);

            n = stream.ReadShort();
            this.Actions = stream.ReadObjectArray<ScriptAction>(n);
        }

        public override string ToString()
        {
            string s = "IF\r\n";
            foreach (var o in this.Conditions)
            {
                s += string.Format("    {0}\r\n", o);
            }
            s += "THEN\r\n";
            foreach (var o in this.Actions)
            {
                s += string.Format("    {0}\r\n", o);
            }
            return s;
        }
    }

    public class ScriptCondition: YodaDeserializable
    {
        int Code;
        int Arg1;
        int Arg2;
        int Arg3;
        int Arg4;
        int Arg5;
        int Arg6;

        public void Deserialize(YodaReader stream)
        {
            this.Code = stream.ReadShort();
            this.Arg1 = stream.ReadShort();
            this.Arg2 = stream.ReadShort();
            this.Arg3 = stream.ReadShort();
            this.Arg4 = stream.ReadShort();
            this.Arg5 = stream.ReadShort();
            this.Arg6 = stream.ReadShort();
        }

        public string[] ArgNames { get { return Script.SCRIPT_CONDITION[this.Code].Args; } }

        private string relevantArgs()
        {
            int[] xs = new int[]{Arg1, Arg2, Arg3, Arg4, Arg5, Arg6};

            var ss = new List<string>();
            for (var i = 0; i < this.ArgNames.Length; i++)
            {
                var s = string.Format("{0}={1}", this.ArgNames[i], xs[i]);
                ss.Add(s);
            }
            
            return string.Join(" ", ss.ToArray());
        }

        public override string ToString()
        {
            return string.Format("{0} {1}", Script.SCRIPT_CONDITION[this.Code].Name, this.relevantArgs());
        }
    }

    public class ScriptAction : YodaDeserializable
    {
        int Code;
        int Arg1;
        int Arg2;
        int Arg3;
        int Arg4;
        int Arg5;
        string Str;

        public void Deserialize(YodaReader stream)
        {
            this.Code = stream.ReadShort();
            this.Arg1 = stream.ReadShort();
            this.Arg2 = stream.ReadShort();
            this.Arg3 = stream.ReadShort();
            this.Arg4 = stream.ReadShort();
            this.Arg5 = stream.ReadShort();

            this.Str = stream.ReadLengthPrefixedString();
        }

        public string[] ArgNames { get { return Script.SCRIPT_ACTION[this.Code].Args; } }

        private string relevantArgs()
        {
            int[] xs = new int[]{Arg1, Arg2, Arg3, Arg4, Arg5};

            var ss = new List<string>();
            for (var i = 0; i < this.ArgNames.Length; i++)
            {
                var s = string.Format("{0}={1}", this.ArgNames[i], xs[i]);
                ss.Add(s);
            }
            if (this.Str != "")
            {
                ss.Add("'" + this.Str + "'");
            }

            return string.Join(" ", ss.ToArray());
        }

        public override string ToString()
        {
            return string.Format("{0} {1}", Script.SCRIPT_ACTION[this.Code].Name, this.relevantArgs());
        }
    }
}
